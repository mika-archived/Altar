use strict;
use warnings;
use feature qw/say/;
use utf8;

use Encode qw/encode_utf8/;
use File::Path qw/mkpath/;
use JSON qw/decode_json/;

sub parse_altar_project {
  return +{} unless $ENV{ALTAR_PROJECT};

  my $json = encode_utf8($ENV{ALTAR_PROJECT});
  return decode_json($json);
}

sub get_safe_path {
  my $full_path = shift;
  my @path_list = split(/\//, $full_path);
  my $safe_path = './';

  for my $path (@path_list) {
    next if ($path =~ /^\./);

    $safe_path .= "/$path";
  }

  return $safe_path;
}

sub create_cpanfile {
  my $root         = shift;
  my $dependencies = shift;
  my $str = '';

  for my $dependency (@{$dependencies}) {
    my $name = $dependency->{name};
    if ($dependency->{version}) {
      my $version = $dependency->{version};

      $str .= "requires '$name', '$version';\n"
    } else {
      $str .= "requires '$name';\n"
    }
  }

  open(HANDLE, '>', "$root/cpanfile") or die 'unknown error';
  print HANDLE $str;
  close(HANDLE);
}

sub create_project_file {
  my $root  = shift;
  my $files = shift;

  for my $file (@{$files}) {
    my $name    = get_safe_path($file->{name});
    my $content = $file->{content};

    open(HANDLE, '>', "$root/$name") or die 'unknown error';
    print HANDLE $content;
    close(HANDLE);
  }
}

sub main {
  my $json = parse_altar_project();
  my $root = './' . $json->{id};

  mkpath($root) or die "unknown error";

  create_cpanfile($root, $json->{dependencies});
  create_project_file($root, $json->{files});
}

main;

unlink $0;
