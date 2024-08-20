import loading from '../assets/images/loading.svg'

export class Loader {
    /**
     * Show loader
     */
    show() {
        if (document.getElementsByClassName("lss-loader").length === 0) {
            const el = document.createElement("div");
            const span = document.createElement("span");
            const elWrap = document.createElement("div");
            elWrap.style.cssText = `
            display: grid; 
            z-index: 20020;
            place-items: center;
            padding: 1rem;
            width: 550px;
            border: 2px solid #666;
            border-radius: 15px;
            background-color:rgba(255, 255, 255, 1);
            `;

            span.textContent = "กำลังประมวลผล กรุณารอสักครู่..."
            span.style.cssText = `
            user-select:none;
            font-weight: 700;
            font-size: 1.3rem;
            color: #333;
            `;

            const svg = document.createElement("img");
            svg.src = `${loading}`
            svg.alt = "กำลังประมวลผล กรุณารอสักครู่..."
            svg.style.cssText = `
                width: 10rem;
                height: 10rem;
            `;

            el.className = "lss-loader";
            el.style.cssText = `
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            position:fixed;
            top:0;
            bottom:0;
            left:0;
            right:0;
            background-color:rgba(255, 255, 255, 0.8);
            z-index:20000;
            overflow: hidden;
            `;
            elWrap.appendChild(svg);
            elWrap.appendChild(span);
            el.appendChild(elWrap);
            document.body.appendChild(el);
            document.body.style.overflow = "hidden";
        }
    }
    /**
     * Remove loader
     */
    close() {
        document.querySelectorAll(".lss-loader").forEach(el => {
            el.remove();
        });
        document.body.style.overflow = "inherit";
    }
}

export default Loader;