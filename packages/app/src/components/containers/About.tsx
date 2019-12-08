import React from "react";

import Container from "../atoms/Container";
import Link from "../molecules/Link";
import Section from "../molecules/Section";
import Wrapper from "../organisms/Wrapper";

const About: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <Section title="About Altar">
          <p>Altar is a Perl 5 online compiler with the CPAN modules available.</p>
          <p>On this site you can</p>
          <ul>
            <li>write Perl 5 code using Visual Studio Code (Monaco Editor) </li>
            <li>run the code and get the results </li>
            <li>use the CPAN modules without creating an environment yourself </li>
            <li>share the code and its result </li>
          </ul>
          <p>Each runs in an isolated environment and not affected by the previous run.</p>
        </Section>
        <Section title="Limitations">
          <ul>
            <li>
              Our site is optimized for desktop, if you want to use optimized-version for mobile, please send
              Pull-Request to&nbsp;
              <Link href="https://github.com/mika-f/Altar">mika-f/Altar</Link>.
            </li>
            <li>You cannot create a private code. All codes are accessible from the Internet.</li>
            <li>
              Installation process of dependent libraries is allowed up to 5 minutes. However, libraries that have been
              installed at least once through the service are cached for faster use.
            </li>
            <li>Perl code can run for up to a minute.</li>
            <li>It does not allow interactive code or animation output.</li>
            <li>For financial reasons, we don't know when the data will disappear.</li>
            <li>For the same reason, we don't know when the service will stop.</li>
          </ul>
        </Section>
      </Container>
    </Wrapper>
  );
};

export default About;
