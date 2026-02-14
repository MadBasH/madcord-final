/** @type {import('next').NextConfig} */
const nextConfig = {
    // Socket.io bağlantı sorunlarını (double-mount) önlemek için Strict Mode kapatılıyor
    reactStrictMode: false,
    
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil"
        });

        return config;
    },
    images: {
        domains: [
            'utfs.io'
        ]
    },
    eslint: {
        ignoreDuringBuilds: true, 
    }
}

module.exports = nextConfig;