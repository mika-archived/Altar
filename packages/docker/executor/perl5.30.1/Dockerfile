FROM perl:5.30.1

RUN true \
  && mkdir -p /usr/local/PROJECT/workspace

WORKDIR /usr/local/PROJECT/workspace
ENV PERL5LIB /usr/local/PROJECT/workspace/lib

CMD ["perl5.30.1","-de0"]