class Snpp < Formula
  desc "Start New Personal Project - A CLI tool for initializing empty projects from templates"
  homepage "https://github.com/yourusername/snpp"
  url "https://github.com/yourusername/snpp/archive/refs/tags/v0.1.0.tar.gz"
  sha256 "TO_BE_FILLED_AFTER_FIRST_RELEASE"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    output = shell_output("#{bin}/snpp --version")
    assert_match "0.1.0", output
  end
end
