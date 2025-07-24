import { Banner } from "../components/Banner";
import { BannerTwo } from "../components/BannerTwo";
import { Destinations } from "../components/Destinations";
import { Navbar } from "../components/Navbar";


export function Home() {
    return (
        <>
            <Navbar />
            <Banner />
            <BannerTwo />
            <Destinations />
        </>
    )
}