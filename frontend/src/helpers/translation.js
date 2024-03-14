function get_translation(code) {
  let result = JSON.parse(localStorage.getItem("translation"));
  if (!result) {
    return "Loading...";
  }

  if (result[code] !== undefined && result[code] !== null) {
    return result[code];
  } else {
    return "Translation not found";
  }
}

export default get_translation;
