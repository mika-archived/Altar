FROM perl:5.30.1

RUN true \
  && cpanm --notest Carton \
  && cpanm --notest Carmel \
  && mkdir -p /usr/local/PROJECT/workspace

RUN true \
  && cpanm --notest JSON \
  && cpanm --notest Data::Validator \
  && mkdir -p /usr/local/PROJECT/installer

COPY ./bin /usr/local/PROJECT/installer/bin

WORKDIR /usr/local/PROJECT/workspace
ENV PERL5LIB /usr/local/PROJECT/workspace/lib

CMD ["perl5.30.1","-de0"]