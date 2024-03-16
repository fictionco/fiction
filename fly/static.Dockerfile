FROM pierrezemb/gostatic as os

FROM os as fiction-docs
COPY ./docs/.vitepress/dist/ /srv/http/
