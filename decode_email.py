import argparse
from email import policy
from email.parser import BytesParser
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="復号するメールファイル")
    source = parser.parse_args().source
    output = source.with_name(f"{source.stem}.decoded.txt")

    message = BytesParser(policy=policy.default).parsebytes(source.read_bytes())
    body = message.get_body(preferencelist=("plain",))

    if body is None:
        raise SystemExit("テキスト形式の本文が見つかりませんでした")

    output.write_text(body.get_content(), encoding="utf-8")


if __name__ == "__main__":
    main()