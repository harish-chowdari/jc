import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { authRoutes } from './authRoutes'
import { restrictedRoutes } from './restrictedRoutes'

const NavigationManager = () => {
    return (
        <Routes>
            {
                authRoutes?.map((route, index) => {
                    return (
                        <Route key={index} path={route.path} element={route.element} />
                    )
                })
            }

            {
                restrictedRoutes?.map((route, index) => {
                    return (
                        <Route key={index} path={route.path} element={route.element} />
                    )
                })
            }
        </Routes>
    )
}

export default NavigationManager