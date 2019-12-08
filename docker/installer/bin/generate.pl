use strict;
use warnings;
use feature qw/say/;
use utf8;

use Data::Validator;
use Encode qw/encode_utf8/;
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

  open(HANDLE, '>', 'cpanfile') or die 'unknown error';
  print HANDLE $str;
  close(HANDLE);
}

sub create_project_file {
  my $files = shift;

  for my $file (@{$files}) {
    my $name    = get_safe_path($file->{name});
    my $content = $file->{content};

    open(HANDLE, '>', $name) or die 'unknown error';
    print HANDLE $content;
    close(HANDLE);
  }
}

sub main {
  my $json = parse_altar_project();

  create_cpanfile($json->{dependencies});
  create_project_file($json->{files});
}

main;

unlink $0;
