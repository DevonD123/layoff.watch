import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";

const LSKey = "editMode";

export interface IInternalUser {
  email: string;
  isAdmin: boolean;
  last_sign_in_at: string | undefined;
  email_confirmed_at: string | Date | null | undefined;
  id: string;
}
export interface IInternalUserContext {
  user?: IInternalUser;
  isEditMode: boolean;
  isLoading?: boolean;
  setEdit: (newVal: boolean) => void;
}

const defaultValue: IInternalUserContext = {
  user: undefined,
  isEditMode: false,
  setEdit: () => {},
};

const InternalUserContext = createContext<IInternalUserContext>(defaultValue);

const InternalUserProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { user, isLoading, error } = useUser();
  if (error) {
    console.error(error);
  }
  const setEdit = (newVal: boolean) => {
    if (user && user?.user_metadata?.isAdmin) {
      window.localStorage.setItem(LSKey, newVal.toString());
      setIsEditMode(newVal);
    }
  };

  useEffect(() => {
    const res = window.localStorage.getItem(LSKey);
    setIsEditMode(res === "true");
  }, []);
  const formattedUser = user
    ? {
        email: user.email || "",
        isAdmin: user.user_metadata.isAdmin as boolean,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        id: user.id,
      }
    : undefined;

  return (
    <InternalUserContext.Provider
      value={{
        user: formattedUser,
        isLoading,
        isEditMode: formattedUser && formattedUser.isAdmin ? isEditMode : false,
        setEdit: formattedUser && formattedUser.isAdmin ? setEdit : () => {},
      }}
    >
      {children}
    </InternalUserContext.Provider>
  );
};

const useInternalUser = () => useContext(InternalUserContext);

export { useInternalUser, InternalUserProvider };
