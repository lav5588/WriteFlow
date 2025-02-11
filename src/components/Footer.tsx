'use client';

export const Footer:React.FC = () => {
    return (
        <footer className=" pb-10">
            <div className=" mt-8 pt-4 text-center">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Write Flow. All rights reserved | Made by Lav Kumar Yadav
                </p>
            </div>
        </footer>
    );
};
