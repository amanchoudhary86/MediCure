const Newsletter = () => {
    return (
        <section className="newsletter section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-12">
                        {/* Start Newsletter Form */}
                        <div className="subscribe-text">
                            <h6>Join Our Health Community</h6>
                            <p className="">
                                Sign up for our newsletter to stay informed about hospital
                                updates, appointment tips, health advice, and innovative
                                solutions designed to enhance your care experience.
                            </p>
                        </div>
                        {/* End Newsletter Form */}
                    </div>
                    <div className="col-lg-6 col-12">
                        {/* Start Newsletter Form */}
                        <div className="subscribe-form">
                            <form action="#" method="get" target="_blank" className="newsletter-inner">
                                <input name="EMAIL" placeholder="Your email address" className="common-input" type="email" />
                                <button className="btn">Subscribe</button>
                            </form>
                        </div>
                        {/* End Newsletter Form */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
