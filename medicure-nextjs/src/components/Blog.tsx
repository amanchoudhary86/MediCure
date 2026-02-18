const Blog = () => {
    return (
        <section className="blog section" id="blog">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <h2>Stay Updated with Our Latest Medical News</h2>
                            <img src="/static/img/section-img.png" alt="#" />
                            <p>
                                Explore the latest updates, medical breakthroughs, and
                                healthcare tips from our experts.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {/* Single Blog */}
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="single-news">
                            <div className="news-head">
                                <img src="/static/img/blog1.jpg" alt="#" />
                            </div>
                            <div className="news-body">
                                <div className="news-content">
                                    <div className="date">03 Feb , 2025</div>
                                    <h2>
                                        <a href="#">Announcing Our Latest Innovative Product</a>
                                    </h2>
                                    <p className="text">
                                        Discover how our new product is set to transform patient
                                        care and enhance medical treatments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Single Blog */}
                    {/* Single Blog */}
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="single-news">
                            <div className="news-head">
                                <img src="/static/img/blog2.jpg" alt="#" />
                            </div>
                            <div className="news-body">
                                <div className="news-content">
                                    <div className="date">03 Feb , 2025</div>
                                    <h2>
                                        <a href="#">Proven Methods to Tackle Common Hospital Visits</a>
                                    </h2>
                                    <p className="text">
                                        Empowering you with easy-to-follow tips and innovative
                                        solutions for a healthier smile.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Single Blog */}
                    {/* Single Blog */}
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="single-news">
                            <div className="news-head">
                                <img src="/static/img/blog3.jpg" alt="#" />
                            </div>
                            <div className="news-body">
                                <div className="news-content">
                                    <div className="date">03 Feb , 2025</div>
                                    <h2>
                                        <a href="#">Delivering Advanced Medical Solutions for Your Business</a>
                                    </h2>
                                    <p className="text">
                                        We provide innovative medical technologies and solutions to
                                        enhance patient care and hospital efficiency.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Single Blog */}
                </div>
            </div>
        </section>
    );
};

export default Blog;
