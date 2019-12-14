## Altar Perl Installer

The Altar Perl Installer performs the following tasks:

- Parsing `ALTER_PROJECT` environment variable
- Generate a project files including `cpanfile`
- Installing dependencies from generated `cpanfile`

`ALTAR_PROJECT` environment variable is JSON format and satisfies the following format.

```typescript
type File = {
  name: string;
  content: string;
};

type AltarProject = {
  // Project ID
  id: string;
  // Perl5 executor machine name such as "5-30-1"
  executor: string;
  // Reserved
  title: string;
  // Project Files
  files: File[];
  // Project Dependencies, Name or Name@Version
  dependencies: string[];
};
```

example request JSON is...

```json
{
  "id": "40dab206-f502-448d-bfab-402cccad58e7",
  "executor": "5.30.1",
  "title": "Data::Validator Examples",
  "files": [
    {
      "name": "main.pl",
      "content": "use feature qw/say state/;\nuse strict;\nuse utf8;\nuse warnings;\n\npackage Example::PerlSnippet;\nuse Data::Validator;\n  \nsub say_hello {\n    state $v; $v //= Data::Validator->new(\n        str => 'Str',\n    )->with(qw/Method/);\n    my ($class, $args) = $v->validate(@_);\n    my ($str, ) = @$args{qw/str/};\n\n    say \"Hello, $str\";\n}\n  \npackage main;\n\nExample::PerlSnippet->say_hello(str => \"Altar\");"
    }
  ],
  "dependencies": [
    "Data::Validator"
  ]
}
```

this example request generates below files.

```perl
# main.pl
use features qw/say state/;
use strict;
use utf8;
use warnings;

use Data::Validator;

sub say_hello {
    state $v; $v //= Data::Validator->new(
        str => 'Str',
    )->with(qw/Method/);
    my ($class, $args) = $v->validate(@_);
    my ($str, ) = @$args{qw/str/};

    say "Hello, $str";
}

say_hello("Altar");
```

and

```perl
# cpanfile
requires 'Data::Validator';
```
