export class Config {
    public static readonly PROD_MODE = import.meta.env.VITE_PROD_MODE;

    public static readonly BACKEND_URL = (Config.PROD_MODE === "true" )
        ? '/rtmp'
        : "http://127.0.0.1:5900";
}
