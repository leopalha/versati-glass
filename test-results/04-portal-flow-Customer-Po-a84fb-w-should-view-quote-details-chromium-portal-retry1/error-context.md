# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e3]:
        - heading "404" [level=1] [ref=e4]
        - generic [ref=e5]:
            - heading "Pagina nao encontrada" [level=2] [ref=e6]
            - paragraph [ref=e7]: A pagina que voce esta procurando pode ter sido removida, renomeada ou esta temporariamente indisponivel.
        - generic [ref=e8]:
            - link "Voltar ao Inicio" [ref=e9] [cursor=pointer]:
                - /url: /
                - img [ref=e10]
                - text: Voltar ao Inicio
            - link "Ver Produtos" [ref=e13] [cursor=pointer]:
                - /url: /produtos
                - img [ref=e14]
                - text: Ver Produtos
        - generic [ref=e17]:
            - link "Solicitar Orcamento" [ref=e18] [cursor=pointer]:
                - /url: /orcamento
                - img [ref=e19]
                - text: Solicitar Orcamento
            - text: '|'
            - link "Falar pelo WhatsApp" [ref=e21] [cursor=pointer]:
                - /url: https://wa.me/5521982536229
                - img [ref=e22]
                - text: Falar pelo WhatsApp
    - region "Notifications (F8)":
        - list
```
