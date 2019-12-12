import React from "react";
import { useTranslation, Trans } from "react-i18next";

import Container from "../atoms/Container";
import Link from "../molecules/Link";
import Section from "../molecules/Section";
import Wrapper from "../organisms/Wrapper";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Container>
        <Section title={t("about.section1.title")}>
          <p>{t("about.section1.description")}</p>
          <p>{t("about.section1.on_this_site.title")}</p>
          <ul>
            <li>{t("about.section1.on_this_site.1")}</li>
            <li>{t("about.section1.on_this_site.2")}</li>
            <li>{t("about.section1.on_this_site.3")}</li>
            <li>{t("about.section1.on_this_site.4")}</li>
          </ul>
          <p>{t("about.section1.attention")}</p>
        </Section>
        <Section title={t("about.section2.title")}>
          <ul>
            <li>
              <Trans i18nKey="about.section2.limitations.1">
                <Link href="https://github.com/mika-f/Altar"></Link>
              </Trans>
            </li>
            <li>{t("about.section2.limitations.2")}</li>
            <li>{t("about.section2.limitations.3")}</li>
            <li>{t("about.section2.limitations.4")}</li>
            <li>{t("about.section2.limitations.5")}</li>
            <li>{t("about.section2.limitations.6")}</li>
            <li>
              <Trans i18nKey="about.section2.limitations.7">
                <b></b>
              </Trans>
            </li>
            <li>{t("about.section2.limitations.8")}</li>
            <li>{t("about.section2.limitations.9")}</li>
            <li>{t("about.section2.limitations.10")}</li>
          </ul>
        </Section>
      </Container>
    </Wrapper>
  );
};

export default About;
