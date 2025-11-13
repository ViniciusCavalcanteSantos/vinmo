"use client";

import {DeleteOutlined, InboxOutlined} from "@ant-design/icons";
import {Button, Image, Progress} from "antd";
import {useDropzone} from "react-dropzone";
import {useT} from "@/i18n/client";
import React, {useEffect} from "react";
import {filesize} from "filesize";
import i18next from "@/i18n/i18next";
import {v4 as uuidv4} from "uuid";

type FileStatus = 'uploading' | 'success' | 'error';

export interface FileWithUploadData extends File {
  id: string,
  progress?: number;
  status?: FileStatus;
  clientId?: number;
  imageId?: string;
  preview?: string;
}

interface DropzoneProps {
  onFilesAdded: (files: FileWithUploadData[]) => void;
  onFilesRemoved?: (files: FileWithUploadData) => void;
  files: FileWithUploadData[];
  icon?: React.ReactNode,
  title?: string,
  description?: string,
}

const DropzoneItem = React.memo(({file, onRemove}: {
  file: FileWithUploadData,
  onRemove: (file: FileWithUploadData) => void
}) => {
  if (!(file instanceof Blob)) return null;
  const url = file.preview;

  const {t} = useT();

  return (
    <li
      className="
                  flex items-center gap-6
                  bg-ant-bg-elevated
                  border border-ant-border-sec
                  shadow-ant-1
                  py-2 px-4 text-start rounded-lg mb-2
                "
    >
      <Image
        className="rounded-avatar"
        src={url}
        width={32}
        height={32}
        preview={false}
      />

      <div className="flex-1">
        <h4 className="text-ant-text-sec text-sm">
          {file.name} ({filesize(file.size, {locale: i18next.language})})
        </h4>

        <Progress
          percent={file.progress}
          status={
            file.status === 'uploading'
              ? 'active'
              : file.status === 'success'
                ? 'success' : 'exception'
          }
        />
        {file.status === 'error' && (
          <span className="text-[var(--color-ant-error)]">
                      {t("Falha no envio")}
                    </span>
        )}
      </div>

      <Button
        shape="circle"
        icon={<DeleteOutlined/>}
        danger
        disabled={file.status !== 'success'}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(file);
        }}
      >
      </Button>
    </li>
  )
})


export default function Dropzone(
  {
    onFilesAdded,
    onFilesRemoved,
    files = [],
    icon = <InboxOutlined className="!text-ant-primary text-5xl"/>,
    title,
    description,
  }: DropzoneProps
) {
  const {t} = useT();
  title = title ?? t('dropzone.title');
  description = description ?? t('dropzone.description');

  useEffect(() => {
    return () => {
      files.forEach(file => file.preview && URL.revokeObjectURL(file.preview))
    }
  }, [files]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      const filesWithProgress = acceptedFiles.map((file) =>
        Object.assign(file, {
          id: uuidv4(),
          progress: 0,
          status: 'uploading' as FileStatus,
          preview: URL.createObjectURL(file),
        })
      );
      onFilesAdded(filesWithProgress);
    },
    multiple: true,
  });

  const removeFile = (file: FileWithUploadData) => {
    if (file.preview) URL.revokeObjectURL(file.preview);
    onFilesRemoved?.(file);
  };

  return (
    <div
      {...getRootProps()}
      className={`
        transition-colors duration-200
        border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
        bg-app-bg
        hover:border-ant-primary
        ${isDragActive ? "border-ant-primary !bg-ant-primary/10 dark:!bg-ant-fill-sec" : "border-gray-300 dark:border-ant-border-sec"}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
        <p className="ant-upload-drag-icon mb-4">
          {icon}
        </p>
        <p className="ant-upload-text text-ant-text text-base mb-1">
          {title}
        </p>
        <p className="ant-upload-hint text-ant-text-sec">
          {description}
        </p>
      </div>
      {files.length > 0 && (
        <ul className="mt-4">
          {files.map((file: FileWithUploadData) => {

            return (
              <DropzoneItem key={file.id} file={file} onRemove={removeFile}/>
            )
          })}
        </ul>
      )}
    </div>
  );
}

