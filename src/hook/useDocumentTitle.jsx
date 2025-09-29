import React, { useEffect } from "react";

const useDocumentTitle = (text) => {
  useEffect(() => {
    document.title = text;
  }, []);
};

export default useDocumentTitle;
