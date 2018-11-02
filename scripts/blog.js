import Api from './api';

class Blog {
    constructor() {
        this.blogApi         = new Api('https://wt-4662f45b9eefda7172b747b28d23efdb-0.sandbox.auth0-extend.com/blog');
        this.articles        = [];
        this.slider          = document.querySelector('#blog__slider');
        this.slidesContainer = document.querySelector('#blog__slider__slides');
        this.leftArrow       = document.querySelector('#blog__slider__left-arrow');
        this.rightArrow      = document.querySelector('#blog__slider__right-arrow');
        this.preLoader       = document.querySelector('#blog__pre-loader');
        this.sliderControls  = document.querySelector('#blog_slider_controls');
        this.currentSlide    = 0;
        this.totalSlides     = 0;
    }

    async fetchBlogArticles () {
        const {success, data} = await this.blogApi.get();
        if (!success) {
            return [];
        }
        return data;
    }

    moveSlider (target) {
        const slides = document.querySelectorAll('.blog__slider__slide');
        const constrols = document.querySelectorAll('#blog_slider_controls li a');
        
        slides[this.currentSlide].classList.add('blog__slider__slide--hidden');
        slides[target].classList.remove('blog__slider__slide--hidden'); 

        constrols[this.currentSlide].classList.remove('selectted');
        constrols[target].classList.add('selectted');
        this.currentSlide = target;
    }

    async initSlider () {
        this.articles = await this.fetchBlogArticles();
        this.totalSlides = this.articles.length;
        let slides = '';
        let controls = '';
        this.articles.forEach((item, index) => {
            slides += `<div class='blog__slider__slide ${index > 0 ? 'blog__slider__slide--hidden' : ''}'>
                            <div class='blog__slider__slide__section'>
                                <img src='${item.images.desktop}' />
                            </div>
                            <div class='blog__slider__slide__section'>
                                <h2>${item.title}</h2>
                                <p>${item.description}</p>
                                <div class='buttons'>
                                    <a href='${item.url}' class='button button--blue'>Read now</a>
                                    <span class='button'>Add your bookmarks</span>
                                </div>
                            </div>
                        </div>`
            
            controls += `<li><a href='#' data-slide='${index}' class='${index === 0 ? 'selectted' : ''}'></a></li>`;
        });
        this.slidesContainer.innerHTML = slides;
        this.sliderControls.innerHTML = controls;
        setTimeout(() => {
            this.preLoader.classList.add('pre-loader--hidden');
            this.slider.classList.remove('blog__slider--hidden');
        } ,1000);
        
        this.sliderControls.addEventListener('click', e => {
            e.preventDefault();
            this.moveSlider(e.target.getAttribute('data-slide'));
        });

        this.leftArrow.addEventListener('click', e => {
            e.preventDefault();
            const target = this.currentSlide > 0 ? (this.currentSlide - 1) : (this.totalSlides - 1);
            this.moveSlider(target); 
        });

        this.rightArrow.addEventListener('click', e => {
            e.preventDefault();
            const target = this.currentSlide < (this.totalSlides - 1) ? this.currentSlide + 1 : 0;
            this.moveSlider(target); 
        });
    }
}

export default new Blog();