import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";


export const ProtectedRoute = ({element: Component}) => {
    const location = useLocation();

    return ApiService.isAuthenticated() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    );
};


export const AdminRoute = ({element: Component}) => {
    const location = useLocation();

    return ApiService.isAdmin() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    );
};

export const UserRoute = ({element: Component}) => {
    const location = useLocation();

    // Block admin from accessing user pages
    if (ApiService.isAdmin()) {
        return <Navigate to="/admin" replace state={{from: location}}/>;
    }

    return ApiService.isAuthenticated() ? (
        Component
    ):(
        <Navigate to="/login" replace state={{from: location}}/>
    );
};