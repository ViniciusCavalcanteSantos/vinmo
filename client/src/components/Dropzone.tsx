"use client";

import {DeleteOutlined, InboxOutlined,} from "@ant-design/icons";
import {Button, Image, Progress} from "antd";
import {useDropzone} from "react-dropzone";
import {useT} from "@/i18n/client";
import React from "react";
import {filesize} from "filesize";
import i18next from "@/i18n/i18next";
import {v4 as uuidv4} from "uuid";

type FileStatus = 'uploading' | 'success' | 'error';

export interface FileWithUploadData extends File {
  id: string,
  progress?: number;
  status?: FileStatus;
  clientId?: number;
}

interface DropzoneProps {
  onFilesAdded: (files: FileWithUploadData[]) => void;
  onFilesRemoved?: (files: FileWithUploadData) => void;
  files: FileWithUploadData[];
  icon?: React.ReactNode,
  title?: string,
  description?: string,
}

export default function Dropzone(
  {
    onFilesAdded,
    onFilesRemoved,
    files = [],
    icon = <InboxOutlined className="!text-primary text-5xl"/>,
    title,
    description,
  }: DropzoneProps
) {
  const {t} = useT();
  title = title ?? t('dropzone.title')
  description = description ?? t('dropzone.description')

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
        })
      );
      onFilesAdded(filesWithProgress);
    },
    onDragEnter: () => {
    },
    onDragLeave: () => {
    },
    onDragOver: () => {
    },
    multiple: true,
  });

  const removeFile = (file: FileWithUploadData) => {
    onFilesRemoved?.(file);
  };

  return (
    <div
      {...getRootProps()}
      className={`transition-colors duration-200 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-neutral-50 hover:border-blue-500
      ${isDragActive ? "border-blue-500 !bg-blue-50" : "border-gray-300"}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
        <p className="ant-upload-drag-icon mb-4">
          {icon}
        </p>
        <p className="ant-upload-text !text-black/88 text-base mb-1">
          {title}
        </p>
        <p className="ant-upload-hint !text-black/45">
          {description}
        </p>
      </div>
      {files.length > 0 && (
        <ul
          className="mt-4"
        >
          {files.map((file: FileWithUploadData, index: number) => {
            if (!(file instanceof Blob)) return null;
            const url = URL.createObjectURL(file);

            return (
              <li
                key={index}
                className="flex items-center gap-6 bg-white shadow-[0_1px_3px_rgba(27,23,30,.1)] py-2 px-4 text-start rounded-lg mb-2"
              >
                <Image
                  className="rounded-avatar"
                  src={url}
                  width={32}
                  height={32}
                  preview={false}
                />

                <div className="flex-1">
                  <h4 className="text-black/48">{file.name} ({filesize(file.size, {locale: i18next.language})})</h4>

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
                    <span className="text-red-500">{t("Falha no envio")}</span>
                  )}
                </div>

                <Button
                  shape="circle"
                  icon={<DeleteOutlined/>}
                  danger
                  disabled={file.status !== 'success'}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file);
                  }}
                >
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
}