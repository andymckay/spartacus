FROM mozillamarketplace/centos-phantomjs-mkt:0.1

ENV IS_DOCKER 1

RUN mkdir -p /srv/spartacus
ADD package.json /srv/spartacus/package.json

WORKDIR /srv/spartacus
RUN npm install
