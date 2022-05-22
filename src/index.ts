/// <reference path=".d.ts"/>
import ASSET_MANIFEST from "__STATIC_CONTENT_MANIFEST";
import {getAssetFromKV,NotFoundError,MethodNotAllowedError,mapRequestToAsset} from '@cloudflare/kv-asset-handler';

// FIX ASSET_MANIFEST BUG
const ASSET_MANIFEST_PARSED = JSON.parse(ASSET_MANIFEST)
const FIXED_ASSET_MANIFEST: any = {};
for (var key in ASSET_MANIFEST_PARSED) {

    // CONVERT BACKSLASH TO FORWARD SLASH
    const newKey = key.replace(/\\/g, '/')
    FIXED_ASSET_MANIFEST[newKey] = ASSET_MANIFEST_PARSED[key];

}

async function getAsset(request: Request, url: URL, env: any, ctx: any, useFix = false) {
    try {

        const result = await getAssetFromKV({
            request,
            waitUntil(promise) {
                return ctx.waitUntil(promise)
            },
        }, {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: useFix ? FIXED_ASSET_MANIFEST : ASSET_MANIFEST_PARSED,
        })

        return result;

    } catch (error) {
        console.log(error);
        return new Response(url.pathname + " not found", {
            headers: {
                status: "404"
            }
        })
    }

}



export default {
    async fetch(request: Request, env: any, ctx: any): Promise < Response > {
        const url = new URL(request.url);
        console.log("params", url.searchParams.get("fix"))
        if (url.pathname.includes(".")) {
            return getAsset(request, url, env, ctx, url.searchParams.get("fix") == "true");
        }

        return new Response("Hello World!");

    },
};