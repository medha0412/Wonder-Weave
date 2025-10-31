import { Banner } from "../components/Banner";
import { BannerTwo } from "../components/BannerTwo";
import { Navbar } from "../components/Navbar";
import AppBenefits from "../components/AppBenefits";
import Blog from "../components/Blog";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export function Home() {
    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
            const el = document.querySelector(location.hash);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location]);
    return (
        <>
            <Navbar />
            <Banner />
            <BannerTwo />
            <Blog />
            <AppBenefits />
        </>
    )
}