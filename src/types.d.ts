interface Delete {
	deleteable: boolean;
	reason: string;
}

interface Band {
	mac: string;
	cipher: string;
	rssi: number;
	rate: {
		us: number | string;
		ds: number | string;
	};
	props: string;
}

interface Bands {
	ghz24?: Band;
	ghz5?: Band;
}

interface KnownWlanDevice {
	uid: string;
	name: string;
	delete: Delete;
	type: "active" | "passive";
	bands: Bands;
	ip: string;
}

interface WlanSettings {
	isRepeater: boolean;
	protocol: string;
	hasTriband: boolean;
	deviceName: string;
	productName: string;
	knownWlanDevices: KnownWlanDevice[];
	activeNexusClient: boolean;
	apActiveScnd: string;
	protocolScnd: string;
	masterIP: string;
	fritzAppFonSupport: boolean;
	hasQuadband: boolean;
	sanityCheck: boolean;
	failClients: any[];
	mac: string;
	MACFilter: string;
	ssid: string;
	differentSSIDs: string;
	bridgeMode: string;
	hiddenSSID: string;
	apActive: string;
	psk: string;
	ssidScnd: string;
	protocolThrd: string;
	macScnd: string;
	hasDoubleWLAN: boolean;
	encryption: string;
	wlanAta: boolean;
	wpsActive: boolean;
	protocolFrth: string;
}

interface Data {
	wlanSettings: WlanSettings;
}

interface FritzBoxWlanDevicesResponse {
	pid: string;
	hide: {
		shareUsb: boolean;
		liveTv: boolean;
		faxSet: boolean;
		provServ: boolean;
		rrd: boolean;
		rss: boolean;
		mobile: boolean;
		dectMail: boolean;
		dectRdio: boolean;
		ssoSet: boolean;
		liveImg: boolean;
	};
	timeTillLogout: string;
	time: any[];
	data: Data;
	sid: string;
}
