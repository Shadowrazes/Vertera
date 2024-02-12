function get_translation(code) {
    let result = JSON.parse(localStorage.getItem('translation'));
    if(!result) {
        return 'Loading...';
    }
    
    return result[code];
}

export default get_translation;