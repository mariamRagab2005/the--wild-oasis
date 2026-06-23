/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`;


function ProtectedRoute({children}) {
  
   const navigate = useNavigate();

    // 1. Check if the user is authenticated
     const { isLoading ,isAuthenticated} = useUser();

      // 2. If not authenticated, redirect to login page
   
    useEffect( function ()  {
        if(!isAuthenticated && !isLoading) {
            navigate("/login");
        }}, 
        [isAuthenticated, isLoading, navigate]
    );


    // 3. While checking, you can show a loading spinner or something

    if(isLoading) {
        return (
             <FullPage>
                <Spinner />
            </FullPage>);
    }

   

    //4. If authenticated, render the app

     if(!isAuthenticated) {
        return  null; // or a redirect to login page
    }

  return   children;
}

export default ProtectedRoute;