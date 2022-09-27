import React from "react";
import styled from "@emotion/styled";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
  @media (max-width: 950px) {
    flex-direction: column;
  }
`;

const MainContnet = styled.div`
  flex: 10;
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 250px;
  background-color: blue;
  @media (max-width: 950px) {
    /* height: 100%; */
  }
`;

function ContentWithSidebar({ children }: React.PropsWithChildren<{}>) {
  return (
    <StyledContainer>
      <MainContnet>{children}</MainContnet>
      <SidebarContainer>sidebar</SidebarContainer>
    </StyledContainer>
  );
}

export default ContentWithSidebar;
