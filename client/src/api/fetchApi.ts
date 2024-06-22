const fetchApi = async (query: string) => {
    try {
        const response = await fetch("/graphql", {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                query: query
            }),
        })

        return await response.json();
    } catch (e) {
        console.error(e);
    }
    
    return {data: null};
}

export default fetchApi;