import styled from "@emotion/styled";
import { minDesktopQueryWithMedia } from "@h/hooks/useMediaQueries";

const TwoColStack = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 20px;
  ${minDesktopQueryWithMedia} {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: masonry;
  }
`;

export default TwoColStack;
