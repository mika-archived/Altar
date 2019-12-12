// Data::Validator Template

const CODE = `
use feature qw/say state/;
use strict;
use utf8;
use warnings;

package Example::PerlSnippet;
use Data::Validator;

sub say_hello {
    state $v; $v //= Data::Validator->new(
        str => 'Str',
    )->with(qw/Method/);
    my ($class, $args) = $v->validate(@_);
    my ($str, ) = @$args{qw/str/};

    say "Hello, $str";
}

package main;

Example::PerlSnippet->say_hello(str => "Altar");`.trim();

const DEPENDENCIES = [{ name: "Data::Validator", version: null }];

export default { CODE, DEPENDENCIES };
