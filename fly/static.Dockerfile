FROM pierrezemb/gostatic as os

RUN ls -la .

FROM os as fiction-docs
RUN ls -la ./docs/.vitepress
COPY ./docs/.vitepress/dist/ /srv/http/
