import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
			registerType: "autoUpdate",
			manifest: {
				name: "CO2 SmartHome",
				short_name: "CO2 SmartHome",
				description: "CO2 Monior for your smart home",
				icons: [
					{
						src: "./pwa-64x64.png",
						sizes: "64x64",
						type: "image/png",
					},
					{
						src: "./pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "./pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "./pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "./pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
});
