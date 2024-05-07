import { useState } from "react";
import ThemeDropdowns from "../components/theme-dropdowns";
import FileInput from "../components/file-input";

export default function Test() {
  const [selectedUnit, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedThemeId] = useState(null);
  const [selectedSubTheme, setSelectedSubThemeId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);

  const handleUnitIdChange = (unit) => {
    setSelectedUnitId(unit);
  };

  const handleThemeIdChange = (theme) => {
    setSelectedThemeId(theme);
  };

  const handleSubThemeIdChange = (subTheme) => {
    setSelectedSubThemeId(subTheme);
  };

  const handleIsVisibleChange = (isVisible) => {
    setIsVisible(isVisible);
  };

  const handleError = (error) => {
    setError(error);
  };

  const handleFileUploadResult = (filePaths) => {
    console.log("Результат загрузки файлов:", filePaths);
  };

  return (
    <>
      <ThemeDropdowns
        onUnitIdChange={handleUnitIdChange}
        onThemeIdChange={handleThemeIdChange}
        onSubThemeIdChange={handleSubThemeIdChange}
        isVisibleChange={handleIsVisibleChange}
        onError={handleError}
      />

      <FileInput onFileUploadResult={handleFileUploadResult} />
    </>
  );
}

// export default function Test() {
//   return;
// }
