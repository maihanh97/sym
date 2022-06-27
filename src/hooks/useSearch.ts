import React from "react";

function useSearch() {
  const [keyword, setKeyword] = React.useState("");

  const filterByKeyword = (arrayOfData: any) => {
    return arrayOfData.filter(
      (data: any) =>
        !!Object.values(data)
          .map((a) => (typeof a === "string" ? a.toLowerCase() : ""))
          .find((a) => a.search(keyword?.toLowerCase()) > -1)
    );
  };

  return { keyword, setKeyword, filterByKeyword };
}

export default useSearch;
