var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},l={},o=e.parcelRequire4383;null==o&&((o=function(e){if(e in t)return t[e].exports;if(e in l){var o=l[e];delete l[e];var a={id:e,exports:{}};return t[e]=a,o.call(a.exports,a,a.exports),a.exports}var d=new Error("Cannot find module '"+e+"'");throw d.code="MODULE_NOT_FOUND",d}).register=function(e,t){l[e]=t},e.parcelRequire4383=o);var a=o("bMZn5"),d=o("aFV0K"),n=o("bTcpz"),s=o("2RaI1");let i=[],r=[];const c={empty:document.querySelector(".empty"),gallery:document.querySelector(".js-gallery"),galleryItem:document.querySelector(".gallery"),filter:document.querySelector(".filter-thumb"),preloaderElem:document.querySelector(".preloader"),modal:document.querySelector("[data-modal]"),modalElem:document.querySelector(".modal-content"),closeModalBtn:document.querySelector("[data-modal-close]"),btnLogout:document.querySelector(".btnLogout"),play:document.querySelector(".play")};let u,y=!0;c.gallery.style.overflowY="auto",c.closeModalBtn.addEventListener("click",(function(){f(),d.default.clearContent(c.gallery),m(y?r:i)})),c.galleryItem.addEventListener("click",(function(e){u=i.find((t=>t.id===Number(e.target.id)))??r.find((t=>t.id===Number(e.target.id))),void 0!==u.youtubeId?c.play.style.display="block":c.play.style.display="none";n.default.prepareModalContent(c.modalElem,u),n.default.renderModalBtns(i,r,c.modalElem,Number(e.target.id)),f()})),c.modalElem.addEventListener("click",(function(e){const t=e.target.parentElement.children;if(e.target.classList.contains("queue")){if(e.target.classList.contains("remove")){(0,s.deleteMovie)(u.id);const l=i.indexOf(u);i.splice(l,1),e.target.classList.toggle("remove"),e.target.textContent="Add to queue",t[0].removeAttribute("disabled")}else u.isQueue=!0,u.isWatch=!1,i.push(u),(0,s.addMovie)(u),e.target.classList.toggle("remove"),e.target.textContent="Remove from queue",t[0].setAttribute("disabled","disabled");m(i)}if(e.target.classList.contains("watched")){if(e.target.classList.contains("remove")){(0,s.deleteMovie)(u.id);const l=r.indexOf(u);r.splice(l,1),e.target.classList.toggle("remove"),e.target.textContent="Add to watched",t[1].removeAttribute("disabled")}else u.isWatch=!0,u.isQueue=!1,r.push(u),(0,s.addMovie)(u),e.target.classList.toggle("remove"),e.target.textContent="Remove from watched",t[1].setAttribute("disabled","disabled");m(r)}})),c.btnLogout.addEventListener("click",(function(){(0,a.logout)()})),c.play.addEventListener("click",(function(){const e=new Plyr("#player",{});c.play.style.display="none",n.default.prepareModalPreview(c.modalElem,u.youtubeId),window.player=e})),window.addEventListener("keydown",(function(e){"Escape"===e.code&&(c.modal.classList.contains("is-hidden")||f())}));const g=c.filter.querySelectorAll(".filter");for(const e of g)e.addEventListener("change",p);function m(e){const t=d.default.creatGalleryItems(e);d.default.markupContent(t,c.gallery)}function p(e){d.default.clearContent(c.gallery),1===Number(e.target.value)?r.length?(y=!0,c.empty.style.display="none",c.preloaderElem.classList.toggle("is-hidden"),c.gallery.classList.remove("is-hidden"),m(r),c.preloaderElem.classList.toggle("is-hidden")):(c.empty.style.display="block",c.gallery.classList.add("is-hidden")):i.length?(y=!1,c.empty.style.display="none",c.preloaderElem.classList.toggle("is-hidden"),c.gallery.classList.remove("is-hidden"),m(i),c.preloaderElem.classList.toggle("is-hidden")):(c.empty.style.display="block",c.gallery.classList.add("is-hidden"))}function f(){c.modal.classList.toggle("is-hidden")}(0,a.onAuthStateChanged)(a.auth,(e=>{e?(d.default.clearContent(c.gallery),c.btnLogout.style.display="inline-block",(0,s.getQueueMovies)(e.uid).then((e=>i=e)),(0,s.getWatchMovies)(e.uid).then((e=>{e.length?(c.empty.style.display="none",c.preloaderElem.classList.toggle("is-hidden"),c.gallery.classList.remove("is-hidden"),m(e),c.preloaderElem.classList.toggle("is-hidden")):(c.empty.style.display="block",c.gallery.classList.add("is-hidden")),r=e}))):(c.btnLogout.style.display="none",location.href="./index.html")}));
//# sourceMappingURL=my-library.3282367f.js.map