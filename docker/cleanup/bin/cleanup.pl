use strict;
use warnings;
use utf8;

use Encode qw/encode_utf8/;
use File::Path qw/rmtree/;
use JSON qw/decode_json/;

sub parse_altar_project {
  return +{} unless $ENV{ALTAR_PROJECT};

  my $json = encode_utf8($ENV{ALTAR_PROJECT});
  return decode_json($json);
}

sub main {
  my $json = parse_altar_project();
  my $root = './' . $json->{id};

  rmtree($root) or die "unknown error";
}

main;