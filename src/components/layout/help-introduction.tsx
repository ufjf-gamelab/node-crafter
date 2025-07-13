import React from "react";
import { useTranslation } from "react-i18next";
import { ActionIcon, Modal, Tooltip } from "@mantine/core";
import { BiSolidHelpCircle } from "react-icons/bi";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeExternalLinks from "rehype-external-links";

const HelpIntroduction: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [content, setContent] = React.useState("");
  const [opened, setOpened] = React.useState(false);

  React.useEffect(() => {
    import(`@/locale/docs/${i18n.language}/introduction.md`)
      .then((res) => fetch(res.default))
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch(() => setContent("<br/>" + t("common.nodeDocNotFound")));
  }, [i18n.language]);

  return (
    <>
      <Tooltip label={t("introductionDoc.buttonTooltip")}>
        <ActionIcon
          color="dark"
          variant="subtle"
          onClick={() => setOpened(true)}
          size="input-lg"
          className="fixed right-0 z-10 text-3xl rounded-full">
          <BiSolidHelpCircle />
        </ActionIcon>
      </Tooltip>

      <Modal
        size="xl"
        title={t(`introductionDoc.modalTitle`)}
        opened={opened}
        onClose={() => setOpened(false)}
        classNames={{ title: "text-3xl font-semibold", body: "markdown" }}>
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize, [rehypeExternalLinks, { target: "_blank" }]]} remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </Modal>
    </>
  );
};

export { HelpIntroduction };
