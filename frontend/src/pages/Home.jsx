import { Banner } from "../components/Banner";
import { BannerTwo } from "../components/BannerTwo";
import { Navbar } from "../components/Navbar";
import HowItWorks  from '../components/HowItWorks';
import AppBenefits from "../components/AppBenefits";
export function Home() {
    return (
        <>
            <Navbar />
            <Banner />
            <BannerTwo />
            <HowItWorks />
            <AppBenefits />
        </>
    )
}