import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import QSP from "@h/qsp";

interface IFilters {
  is_draft: null | boolean;
  id: null | string;
  text: null | string;
}

function usePgData() {
  const router = useRouter();
  const [pg, setPg] = useState(1);
  const [filters, setFilters] = useState<IFilters>({
    is_draft: null,
    id: null,
    text: null,
  });
  const pgQSP = router.query[QSP.page];

  useEffect(() => {
    const fObj: IFilters = {
      is_draft: null,
      id: null,
      text: null,
    };
    const is_draft = router.query[QSP.filter_is_draft] as string;
    const textFilter = router.query[QSP.filter_text] as string;
    const id_filter = router.query[QSP.filter_id] as string;
    if (is_draft === "1") {
      fObj.is_draft = true;
    } else if (is_draft === "0") {
      fObj.is_draft = false;
    }
    if (textFilter) {
      fObj.text = textFilter;
    }
    if (id_filter) {
      fObj.id = id_filter;
    }
    let parsed = parseInt(pgQSP as string);
    if (!pgQSP || isNaN(parsed)) {
      parsed = 1;
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, [QSP.page]: parsed },
        },
        undefined,
        { shallow: true }
      );
    }

    setFilters(fObj);
    setPg(parsed);
  }, [pgQSP]);

  const movePg = (newPg: number) =>
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        [QSP.page]: newPg,
      },
    });

  return {
    pg,
    movePg,
    filters,
  };
}

export default usePgData;
