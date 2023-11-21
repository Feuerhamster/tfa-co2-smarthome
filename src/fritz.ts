import convert from "xml-js";
import { pbkdf2Sync } from "crypto";
import { Timer } from "./utils.js";

interface FBSessionInfo {
	SID: { _text: string };
	Challenge: { _text: string };
}

interface FBLoginResponse {
	SessionInfo: FBSessionInfo;
}

const fritzSessionTimeoutMinutes = 18;

const fritzSessionTimer = new Timer(fritzSessionTimeoutMinutes);

let sid: string;
let usr: string;
let pwd: string;

export function initFritzAPI(username: string, password: string) {
	usr = username;
	pwd = password;
	login();
}

export async function login() {
	const username = usr;
	const password = pwd;

	const res = await fetch("http://fritz.box/login_sid.lua?version=2");
	const raw = await res.text();

	const data = convert.xml2js(raw, { compact: true }) as FBLoginResponse;

	const challenge = data.SessionInfo.Challenge._text.split("$") as [
		string,
		string,
		string,
		string,
		string,
	];

	const [_, iter1, salt1, iter2, salt2] = challenge;

	const hash1 = pbkdf2Sync(
		password,
		Buffer.from(salt1, "hex"),
		parseInt(iter1),
		32,
		"sha256",
	);

	const challengeResponse =
		salt2 +
		"$" +
		pbkdf2Sync(
			hash1,
			Buffer.from(salt2, "hex"),
			parseInt(iter2),
			32,
			"sha256",
		).toString("hex");

	const form = new URLSearchParams();
	form.append("username", username);
	form.append("response", challengeResponse);

	const res2 = await fetch("http://fritz.box/login_sid.lua?version=2", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: form.toString(),
	});

	const raw2 = await res2.text();

	const data2 = convert.xml2js(raw2, { compact: true }) as FBLoginResponse;

	// login failed
	if (data2.SessionInfo.SID._text.match(/^0*$/)) {
		console.error("FAILED FRITZ LOGIN");
	}

	sid = data2.SessionInfo.SID._text;

	fritzSessionTimer.updateTime();
}

async function checkFritzLogin() {
	if (fritzSessionTimer.isTimeUp() || !sid) {
		await login();
		return;
	}
	fritzSessionTimer.updateTime();
}

export async function setLightColor(
	hue: number,
	saturation: number,
	ain: string,
) {
	await checkFritzLogin();
	const res = await fetch(
		`http://fritz.box/webservices/homeautoswitch.lua?switchcmd=setunmappedcolor&ain=${ain}&hue=${hue}&saturation=${saturation}&sid=${sid}`,
	);

	if (res.status !== 200) {
		console.error("FAILED TO TRIGGER LIGHT:\n" + res.status);
	}
}

export async function warningPhoneCall(templateAIN: string) {
	await checkFritzLogin();
	const res = await fetch(
		`http://fritz.box/webservices/homeautoswitch.lua?switchcmd=applytemplate&ain=${templateAIN}&sid=${sid}`,
	);

	if (res.status !== 200) {
		console.error("FAILED TO TRIGGER CALL:\n" + res.status);
	}
}

export async function getWifiDevices() {
	await checkFritzLogin();

	const form = new URLSearchParams();

	form.append("xhr", "1");
	form.append("sid", sid);
	form.append("lang", "de");
	form.append("page", "wSet");
	form.append("xhrId", "wlanDevices");
	form.append("useajax", "1");

	const rawReq = await fetch("http://fritz.box/data.lua", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept": "application/json"
		},
		body: form.toString(),
	});

	const res = await rawReq.json() as FritzBoxWlanDevicesResponse;

	return res.data.wlanSettings.knownWlanDevices;
}
