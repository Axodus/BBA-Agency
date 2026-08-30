# BBA Agency — Product Hero SVGs

Arquivos vetoriais decorativos para `.product-detail-package`.

## Estrutura

- `product-planning-board.svg`: composição principal desktop.
- `product-planning-board-mobile.svg`: composição simplificada.
- `publisher-board.svg`
- `advertising-board.svg`
- `scientific-board.svg`
- `governance-board.svg`
- `research-board.svg`

## Uso recomendado

```html
<aside class="product-detail-package">
  <img
    class="product-detail-package__graphic"
    src="/assets/product-heroes/product-planning-board.svg"
    alt=""
    aria-hidden="true"
  />
</aside>
```

```css
.product-detail-package {
  position: relative;
  overflow: hidden;
}

.product-detail-package__graphic {
  position: absolute;
  right: -4%;
  bottom: -8%;
  width: min(92%, 760px);
  height: auto;
  pointer-events: none;
  user-select: none;
  opacity: .9;
}

@media (max-width: 720px) {
  .product-detail-package__graphic {
    content: url("/assets/product-heroes/product-planning-board-mobile.svg");
    right: -18%;
    bottom: -2%;
    width: 125%;
  }
}
```

Os SVGs usam somente shapes, paths e estilos internos. Não incluem JavaScript, fontes externas, imagens rasterizadas ou filtros pesados.
