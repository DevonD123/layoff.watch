import React from "react";
import styled from "@emotion/styled";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/router";
import { Text } from "@mantine/core";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
  @media (max-width: 950px) {
    flex-direction: column; // will never use this but good for the initial flash
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
  flex-direction: column;
  gap: 15px;
  text-align: center;
`;

const ContentWithSidebar = ({ children }: React.PropsWithChildren<{}>) => {
  const showSidebar = useMediaQuery("(min-width: 950px)");
  return (
    <StyledContainer>
      <MainContnet>{children}</MainContnet>
      {false && showSidebar && (
        <SidebarContainer>
          <SidebarList />
        </SidebarContainer>
      )}
    </StyledContainer>
  );
};

const SidebarList = () => {
  const router = useRouter();
  return (
    <>
      <Text>Sidebar</Text>
    </>
  );
};

export default ContentWithSidebar;
