function get_translation(code) {
    let result = JSON.parse(localStorage.getItem('translation'))[code] || 'Loading...';
    return result;
}

export default get_translation;