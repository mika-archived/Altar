use strict;
use warnings;
use feature qw/say/;
use utf8;

use Encode qw/encode_utf8/;
use JSON qw/decode_json/;

sub parse_altar_project {
  return +{} unless $ENV{ALTAR_PROJECT};

  my $json = encode_utf8($ENV{ALTAR_PROJECT});
  return decode_json($json);
}

sub main {
  my $json = parse_altar_project();
  my $root = './' . $json->{id};

  print $root;
}

main;
