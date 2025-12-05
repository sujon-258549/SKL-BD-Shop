const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white border-t-2 border-cyan-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-sm sm:text-base font-medium">
                            &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
                        </p>
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-sm sm:text-base font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Created by <span className="text-white font-bold">Sujon</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
