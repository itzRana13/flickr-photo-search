export default async function fetchData ({ input = 'landscape', page = 1 }) {
    const uri = 'https://api.flickr.com/services/rest/'

    if (input.trim() === '') {
        input = 'landscape'
    }

    const params = {
        text: `${input} -sexy -ebody -secondlife -rezzroom`,
        page: page,
        method: 'flickr.photos.search',
        api_key: process.env.API_KEY,
        safe_search: 1,
        content_type: 1,
        format: 'json',
        content_types: 0,
        nojsoncallback: 1,
        per_page: 20,
        sort: 'relevance',
        min_upload_date: '2012-03-05 00:00:00',
        extras: 'description,date_taken,owner_name,url_z,url_l,url_q,url_o'
    }

    const res = await fetch(uri + '?' + new URLSearchParams(params))
    const jsonRes = await res.json();

    if (!res.ok || jsonRes.stat !== "ok") {
        const error = new Error(jsonRes.message)
        error.status = jsonRes.code

        throw error
    }

    return jsonRes
}