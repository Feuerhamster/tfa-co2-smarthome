import convert from "xml-js";
import { pbkdf2Sync } from "crypto";

interface FBSessionInfo {
	SID: { _text: string };
	Challenge: { _text: string };
}

interface FBLoginResponse {
	SessionInfo: FBSessionInfo;
}

export async function login() {
	const res = await fetch("http://fritz.box/login_sid.lua?version=2");

	const raw = await res.text();

	const data = convert.xml2js(raw, { compact: true }) as FBLoginResponse;

	console.log(data);

	const challenge = data.SessionInfo.Challenge._text.split("$") as [
		string,
		string,
		string,
		string,
		string,
	];

	const [_, iter1, salt1, iter2, salt2] = challenge;

	const hash1 = pbkdf2Sync(
		"***",
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
	form.append("username", "***");
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

	console.log(data2);

	return data2.SessionInfo.SID._text;
}

export async function setLightColor(
	sid: string,
	hue: number,
	saturation: number,
	ain: string,
) {
	await fetch(
		`http://fritz.box/webservices/homeautoswitch.lua?switchcmd=setunmappedcolor&ain=${ain}&hue=${hue}&saturation=${saturation}&sid=${sid}`,
	);
}

export async function warningCall(sid: string) {
	await fetch(
		`http://fritz.box/webservices/homeautoswitch.lua?switchcmd=applytemplate&ain=tmpEA4803-3F5340E45&sid=${sid}`,
	);
}
