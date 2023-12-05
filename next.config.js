/** @type {import('next').NextConfig} */
require('dotenv').config()

const nextConfig = {
    images: {
        domains: ['live.staticflickr.com']
    },
    output: "export",
    env: {
        API_KEY: '32a8422c952b14ee68dded4e577a2ca3'
    }
}

module.exports = nextConfig
