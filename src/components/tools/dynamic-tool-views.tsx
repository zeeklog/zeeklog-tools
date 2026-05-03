'use client'

import type { ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { ToolRouteLoading } from '@/components/tools/tool-route-loading'

const Lazy_AsciiTextDrawerTool = dynamic(
  () => import('./impl/AsciiTextDrawerTool').then((m) => ({ default: m.AsciiTextDrawerTool })),
  { loading: ToolRouteLoading },
)

const Lazy_Base64FileConverterTool = dynamic(
  () => import('./impl/Base64FileConverterTool').then((m) => ({ default: m.Base64FileConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_Base64StringConverterTool = dynamic(
  () => import('./impl/Base64StringConverterTool').then((m) => ({ default: m.Base64StringConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_BaseConverterTool = dynamic(
  () => import('./impl/BaseConverterTool').then((m) => ({ default: m.BaseConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_UsAddressGeneratorTool = dynamic(
  () => import('./impl/AddressGeneratorsTools').then((m) => ({ default: m.UsAddressGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_UkAddressGeneratorTool = dynamic(
  () => import('./impl/AddressGeneratorsTools').then((m) => ({ default: m.UkAddressGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HkAddressGeneratorTool = dynamic(
  () => import('./impl/AddressGeneratorsTools').then((m) => ({ default: m.HkAddressGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_SgAddressGeneratorTool = dynamic(
  () => import('./impl/AddressGeneratorsTools').then((m) => ({ default: m.SgAddressGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_CaliforniaAddressGeneratorTool = dynamic(
  () => import('./impl/AddressGeneratorsTools').then((m) => ({ default: m.CaliforniaAddressGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_NewZealandAddressGeneratorTool = dynamic(
  () => import('./impl/AddressGeneratorsTools').then((m) => ({ default: m.NewZealandAddressGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_SpainAddressGeneratorTool = dynamic(
  () => import('./impl/AddressGeneratorsTools').then((m) => ({ default: m.SpainAddressGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_BasicAuthGeneratorTool = dynamic(
  () => import('./impl/BasicAuthGeneratorTool').then((m) => ({ default: m.BasicAuthGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_BcryptTool = dynamic(
  () => import('./impl/BcryptTool').then((m) => ({ default: m.BcryptTool })),
  { loading: ToolRouteLoading },
)

const Lazy_BenchmarkBuilderTool = dynamic(
  () => import('./impl/BenchmarkBuilderTool').then((m) => ({ default: m.BenchmarkBuilderTool })),
  { loading: ToolRouteLoading },
)

const Lazy_Bip39GeneratorTool = dynamic(
  () => import('./impl/Bip39GeneratorTool').then((m) => ({ default: m.Bip39GeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_BitmapImageSuiteTool = dynamic(
  () => import('./impl/BitmapImageSuiteTool').then((m) => ({ default: m.BitmapImageSuiteTool })),
  { loading: ToolRouteLoading },
)

const Lazy_CameraRecorderTool = dynamic(
  () => import('./impl/CameraRecorderTool').then((m) => ({ default: m.CameraRecorderTool })),
  { loading: ToolRouteLoading },
)

const Lazy_CaseConverterTool = dynamic(
  () => import('./impl/CaseConverterTool').then((m) => ({ default: m.CaseConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ChartFromCsvTool = dynamic(
  () => import('./impl/ChartFromCsvTool').then((m) => ({ default: m.ChartFromCsvTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ChmodCalculatorTool = dynamic(
  () => import('./impl/ChmodCalculatorTool').then((m) => ({ default: m.ChmodCalculatorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ChronometerTool = dynamic(
  () => import('./impl/ChronometerTool').then((m) => ({ default: m.ChronometerTool })),
  { loading: ToolRouteLoading },
)

const Lazy_CodeFormatterTool = dynamic(
  () => import('./impl/CodeFormatterTool').then((m) => ({ default: m.CodeFormatterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ColorConverterTool = dynamic(
  () => import('./impl/ColorConverterTool').then((m) => ({ default: m.ColorConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_CrontabGeneratorTool = dynamic(
  () => import('./impl/CrontabGeneratorTool').then((m) => ({ default: m.CrontabGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_CssBeautifyMinifyTool = dynamic(
  () => import('./impl/CssBeautifyMinifyTool').then((m) => ({ default: m.CssBeautifyMinifyTool })),
  { loading: ToolRouteLoading },
)

const Lazy_CsvToolkitTool = dynamic(
  () => import('./impl/CsvToolkitTool').then((m) => ({ default: m.CsvToolkitTool })),
  { loading: ToolRouteLoading },
)

const Lazy_CurlToCodeTool = dynamic(
  () => import('./impl/CurlToCodeTool').then((m) => ({ default: m.CurlToCodeTool })),
  { loading: ToolRouteLoading },
)

const Lazy_DateConverterTool = dynamic(
  () => import('./impl/DateConverterTool').then((m) => ({ default: m.DateConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_DeviceInformationTool = dynamic(
  () => import('./impl/DeviceInformationTool').then((m) => ({ default: m.DeviceInformationTool })),
  { loading: ToolRouteLoading },
)

const Lazy_DnsLookupTool = dynamic(
  () => import('./impl/DnsLookupTool').then((m) => ({ default: m.DnsLookupTool })),
  { loading: ToolRouteLoading },
)

const Lazy_DockerRunToDockerComposeConverterTool = dynamic(
  () => import('./impl/DockerRunToDockerComposeConverterTool').then((m) => ({ default: m.DockerRunToDockerComposeConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_EmojiPickerTool = dynamic(
  () => import('./impl/EmojiPickerTool').then((m) => ({ default: m.EmojiPickerTool })),
  { loading: ToolRouteLoading },
)

const Lazy_EncodingToolkitTool = dynamic(
  () => import('./impl/EncodingToolkitTool').then((m) => ({ default: m.EncodingToolkitTool })),
  { loading: ToolRouteLoading },
)

const Lazy_EncryptionTool = dynamic(
  () => import('./impl/EncryptionTool').then((m) => ({ default: m.EncryptionTool })),
  { loading: ToolRouteLoading },
)

const Lazy_EscapeNativeConverterTool = dynamic(
  () => import('./impl/EscapeNativeConverterTool').then((m) => ({ default: m.EscapeNativeConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_EtaCalculatorTool = dynamic(
  () => import('./impl/EtaCalculatorTool').then((m) => ({ default: m.EtaCalculatorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ExcalidrawWhiteboardTool = dynamic(
  () => import('./impl/ExcalidrawWhiteboardTool').then((m) => ({ default: m.ExcalidrawWhiteboardTool })),
  { loading: ToolRouteLoading },
)

const Lazy_FaviconIcoGeneratorTool = dynamic(
  () => import('./impl/FaviconIcoGeneratorTool').then((m) => ({ default: m.FaviconIcoGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_GitMemoTool = dynamic(
  () => import('./impl/GitMemoTool').then((m) => ({ default: m.GitMemoTool })),
  { loading: ToolRouteLoading },
)

const Lazy_GzipDecompressTool = dynamic(
  () => import('./impl/GzipDecompressTool').then((m) => ({ default: m.GzipDecompressTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HashTextTool = dynamic(
  () => import('./impl/HashTextTool').then((m) => ({ default: m.HashTextTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HmacGeneratorTool = dynamic(
  () => import('./impl/HmacGeneratorTool').then((m) => ({ default: m.HmacGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HtmlEntitiesTool = dynamic(
  () => import('./impl/HtmlEntitiesTool').then((m) => ({ default: m.HtmlEntitiesTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HtmlJsLiteralTool = dynamic(
  () => import('./impl/HtmlJsLiteralTool').then((m) => ({ default: m.HtmlJsLiteralTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HtmlStripperTool = dynamic(
  () => import('./impl/HtmlStripperTool').then((m) => ({ default: m.HtmlStripperTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HtmlTableToolsTool = dynamic(
  () => import('./impl/HtmlTableToolsTool').then((m) => ({ default: m.HtmlTableToolsTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HtmlToJsxTool = dynamic(
  () => import('./impl/HtmlToJsxTool').then((m) => ({ default: m.HtmlToJsxTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HtmlToMarkdownTool = dynamic(
  () => import('./impl/HtmlToMarkdownTool').then((m) => ({ default: m.HtmlToMarkdownTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HtmlWysiwygEditorTool = dynamic(
  () => import('./impl/HtmlWysiwygEditorTool').then((m) => ({ default: m.HtmlWysiwygEditorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_HttpStatusCodesTool = dynamic(
  () => import('./impl/HttpStatusCodesTool').then((m) => ({ default: m.HttpStatusCodesTool })),
  { loading: ToolRouteLoading },
)

const Lazy_IbanValidatorAndParserTool = dynamic(
  () => import('./impl/IbanValidatorAndParserTool').then((m) => ({ default: m.IbanValidatorAndParserTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ImageDataUriHelperTool = dynamic(
  () => import('./impl/ImageDataUriHelperTool').then((m) => ({ default: m.ImageDataUriHelperTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ImageFormatConverterTool = dynamic(
  () => import('./impl/ImageFormatConverterTool').then((m) => ({ default: m.ImageFormatConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ImageLsbSteganographyTool = dynamic(
  () => import('./impl/ImageLsbSteganographyTool').then((m) => ({ default: m.ImageLsbSteganographyTool })),
  { loading: ToolRouteLoading },
)

const Lazy_GeminiWatermarkRemoverTool = dynamic(
  () => import('./impl/GeminiWatermarkRemoverTool').then((m) => ({ default: m.GeminiWatermarkRemoverTool })),
  { loading: ToolRouteLoading },
)

const Lazy_IpRepresentationConverterTool = dynamic(
  () => import('./impl/IpRepresentationConverterTool').then((m) => ({ default: m.IpRepresentationConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_Ipv4AddressConverterTool = dynamic(
  () => import('./impl/Ipv4AddressConverterTool').then((m) => ({ default: m.Ipv4AddressConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_Ipv4RangeExpanderTool = dynamic(
  () => import('./impl/Ipv4RangeExpanderTool').then((m) => ({ default: m.Ipv4RangeExpanderTool })),
  { loading: ToolRouteLoading },
)

const Lazy_Ipv4SubnetCalculatorTool = dynamic(
  () => import('./impl/Ipv4SubnetCalculatorTool').then((m) => ({ default: m.Ipv4SubnetCalculatorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_Ipv6UlaGeneratorTool = dynamic(
  () => import('./impl/Ipv6UlaGeneratorTool').then((m) => ({ default: m.Ipv6UlaGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JavascriptCompressTool = dynamic(
  () => import('./impl/JavascriptCompressTool').then((m) => ({ default: m.JavascriptCompressTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsHtmlPrettifyTool = dynamic(
  () => import('./impl/JsHtmlPrettifyTool').then((m) => ({ default: m.JsHtmlPrettifyTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsonDiffTool = dynamic(
  () => import('./impl/JsonDiffTool').then((m) => ({ default: m.JsonDiffTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsonJsonlTool = dynamic(
  () => import('./impl/JsonJsonlTool').then((m) => ({ default: m.JsonJsonlTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsonMinifyTool = dynamic(
  () => import('./impl/JsonMinifyTool').then((m) => ({ default: m.JsonMinifyTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsonPrettifyTool = dynamic(
  () => import('./impl/JsonPrettifyTool').then((m) => ({ default: m.JsonPrettifyTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsonSyntaxHelperTool = dynamic(
  () => import('./impl/JsonSyntaxHelperTool').then((m) => ({ default: m.JsonSyntaxHelperTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsonToCsvTool = dynamic(
  () => import('./impl/JsonToCsvTool').then((m) => ({ default: m.JsonToCsvTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsonToTomlTool = dynamic(
  () => import('./impl/JsonToTomlTool').then((m) => ({ default: m.JsonToTomlTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsonToYamlConverterTool = dynamic(
  () => import('./impl/JsonToYamlConverterTool').then((m) => ({ default: m.JsonToYamlConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JsonpathTesterTool = dynamic(
  () => import('./impl/JsonpathTesterTool').then((m) => ({ default: m.JsonpathTesterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_JwtParserTool = dynamic(
  () => import('./impl/JwtParserTool').then((m) => ({ default: m.JwtParserTool })),
  { loading: ToolRouteLoading },
)

const Lazy_KeycodeInfoTool = dynamic(
  () => import('./impl/KeycodeInfoTool').then((m) => ({ default: m.KeycodeInfoTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ListConverterTool = dynamic(
  () => import('./impl/ListConverterTool').then((m) => ({ default: m.ListConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_LoremIpsumGeneratorTool = dynamic(
  () => import('./impl/LoremIpsumGeneratorTool').then((m) => ({ default: m.LoremIpsumGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_MacAddressGeneratorTool = dynamic(
  () => import('./impl/MacAddressGeneratorTool').then((m) => ({ default: m.MacAddressGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_MacAddressLookupTool = dynamic(
  () => import('./impl/MacAddressLookupTool').then((m) => ({ default: m.MacAddressLookupTool })),
  { loading: ToolRouteLoading },
)

const Lazy_MarkdownToHtmlTool = dynamic(
  () => import('./impl/MarkdownToHtmlTool').then((m) => ({ default: m.MarkdownToHtmlTool })),
  { loading: ToolRouteLoading },
)

const Lazy_MathEvaluatorTool = dynamic(
  () => import('./impl/MathEvaluatorTool').then((m) => ({ default: m.MathEvaluatorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_MermaidPreviewTool = dynamic(
  () => import('./impl/MermaidPreviewTool').then((m) => ({ default: m.MermaidPreviewTool })),
  { loading: ToolRouteLoading },
)

const Lazy_MimeTypesTool = dynamic(
  () => import('./impl/MimeTypesTool').then((m) => ({ default: m.MimeTypesTool })),
  { loading: ToolRouteLoading },
)

const Lazy_NumeronymGeneratorTool = dynamic(
  () => import('./impl/NumeronymGeneratorTool').then((m) => ({ default: m.NumeronymGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_OgMetaGeneratorTool = dynamic(
  () => import('./impl/OgMetaGeneratorTool').then((m) => ({ default: m.OgMetaGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_OtpGeneratorTool = dynamic(
  () => import('./impl/OtpGeneratorTool').then((m) => ({ default: m.OtpGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_PasswordStrengthAnalyserTool = dynamic(
  () => import('./impl/PasswordStrengthAnalyserTool').then((m) => ({ default: m.PasswordStrengthAnalyserTool })),
  { loading: ToolRouteLoading },
)

const Lazy_PdfToImageTool = dynamic(
  () => import('./impl/PdfToImageTool').then((m) => ({ default: m.PdfToImageTool })),
  { loading: ToolRouteLoading },
)

const Lazy_PercentageCalculatorTool = dynamic(
  () => import('./impl/PercentageCalculatorTool').then((m) => ({ default: m.PercentageCalculatorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_PhoneParserAndFormatterTool = dynamic(
  () => import('./impl/PhoneParserAndFormatterTool').then((m) => ({ default: m.PhoneParserAndFormatterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_QrcodeGeneratorTool = dynamic(
  () => import('./impl/QrcodeGeneratorTool').then((m) => ({ default: m.QrcodeGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_RandomPortGeneratorTool = dynamic(
  () => import('./impl/RandomPortGeneratorTool').then((m) => ({ default: m.RandomPortGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_RemPxConverterTool = dynamic(
  () => import('./impl/RemPxConverterTool').then((m) => ({ default: m.RemPxConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_RomanNumeralConverterTool = dynamic(
  () => import('./impl/RomanNumeralConverterTool').then((m) => ({ default: m.RomanNumeralConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_RsaKeyPairGeneratorTool = dynamic(
  () => import('./impl/RsaKeyPairGeneratorTool').then((m) => ({ default: m.RsaKeyPairGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_SafelinkDecoderTool = dynamic(
  () => import('./impl/SafelinkDecoderTool').then((m) => ({ default: m.SafelinkDecoderTool })),
  { loading: ToolRouteLoading },
)

const Lazy_ServerRasterImageConverterTool = dynamic(
  () => import('./impl/ServerRasterImageConverterTool').then((m) => ({ default: m.ServerRasterImageConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_SlugifyStringTool = dynamic(
  () => import('./impl/SlugifyStringTool').then((m) => ({ default: m.SlugifyStringTool })),
  { loading: ToolRouteLoading },
)

const Lazy_SqlPrettifyTool = dynamic(
  () => import('./impl/SqlPrettifyTool').then((m) => ({ default: m.SqlPrettifyTool })),
  { loading: ToolRouteLoading },
)

const Lazy_SqlToDataFormatsTool = dynamic(
  () => import('./impl/SqlToDataFormatsTool').then((m) => ({ default: m.SqlToDataFormatsTool })),
  { loading: ToolRouteLoading },
)

const Lazy_StringObfuscatorTool = dynamic(
  () => import('./impl/StringObfuscatorTool').then((m) => ({ default: m.StringObfuscatorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_StructuredDataViewerTool = dynamic(
  () => import('./impl/StructuredDataViewerTool').then((m) => ({ default: m.StructuredDataViewerTool })),
  { loading: ToolRouteLoading },
)

const Lazy_SvgPlaceholderGeneratorTool = dynamic(
  () => import('./impl/SvgPlaceholderGeneratorTool').then((m) => ({ default: m.SvgPlaceholderGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TabularSpreadsheetConverterTool = dynamic(
  () => import('./impl/TabularSpreadsheetConverterTool').then((m) => ({ default: m.TabularSpreadsheetConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TemperatureConverterTool = dynamic(
  () => import('./impl/TemperatureConverterTool').then((m) => ({ default: m.TemperatureConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TextDiffTool = dynamic(
  () => import('./impl/TextDiffTool').then((m) => ({ default: m.TextDiffTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TextLineProcessorTool = dynamic(
  () => import('./impl/TextLineProcessorTool').then((m) => ({ default: m.TextLineProcessorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TextStatisticsTool = dynamic(
  () => import('./impl/TextStatisticsTool').then((m) => ({ default: m.TextStatisticsTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TextToBinaryTool = dynamic(
  () => import('./impl/TextToBinaryTool').then((m) => ({ default: m.TextToBinaryTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TextToNatoAlphabetTool = dynamic(
  () => import('./impl/TextToNatoAlphabetTool').then((m) => ({ default: m.TextToNatoAlphabetTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TextToUnicodeTool = dynamic(
  () => import('./impl/TextToUnicodeTool').then((m) => ({ default: m.TextToUnicodeTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TokenGeneratorTool = dynamic(
  () => import('./impl/TokenGeneratorTool').then((m) => ({ default: m.TokenGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TomlToJsonTool = dynamic(
  () => import('./impl/TomlToJsonTool').then((m) => ({ default: m.TomlToJsonTool })),
  { loading: ToolRouteLoading },
)

const Lazy_TomlToYamlTool = dynamic(
  () => import('./impl/TomlToYamlTool').then((m) => ({ default: m.TomlToYamlTool })),
  { loading: ToolRouteLoading },
)

const Lazy_UbbHtmlConverterTool = dynamic(
  () => import('./impl/UbbHtmlConverterTool').then((m) => ({ default: m.UbbHtmlConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_UlidGeneratorTool = dynamic(
  () => import('./impl/UlidGeneratorTool').then((m) => ({ default: m.UlidGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_UnitConverterTool = dynamic(
  () => import('./impl/UnitConverterTool').then((m) => ({ default: m.UnitConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_UrlEncoderTool = dynamic(
  () => import('./impl/UrlEncoderTool').then((m) => ({ default: m.UrlEncoderTool })),
  { loading: ToolRouteLoading },
)

const Lazy_UrlParserTool = dynamic(
  () => import('./impl/UrlParserTool').then((m) => ({ default: m.UrlParserTool })),
  { loading: ToolRouteLoading },
)

const Lazy_UserAgentParserTool = dynamic(
  () => import('./impl/UserAgentParserTool').then((m) => ({ default: m.UserAgentParserTool })),
  { loading: ToolRouteLoading },
)

const Lazy_Utf8InspectorTool = dynamic(
  () => import('./impl/Utf8InspectorTool').then((m) => ({ default: m.Utf8InspectorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_UuidGeneratorTool = dynamic(
  () => import('./impl/UuidGeneratorTool').then((m) => ({ default: m.UuidGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_WifiQrcodeGeneratorTool = dynamic(
  () => import('./impl/WifiQrcodeGeneratorTool').then((m) => ({ default: m.WifiQrcodeGeneratorTool })),
  { loading: ToolRouteLoading },
)

const Lazy_XmlDiffTool = dynamic(
  () => import('./impl/XmlDiffTool').then((m) => ({ default: m.XmlDiffTool })),
  { loading: ToolRouteLoading },
)

const Lazy_XmlFormatterTool = dynamic(
  () => import('./impl/XmlFormatterTool').then((m) => ({ default: m.XmlFormatterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_XpathTesterTool = dynamic(
  () => import('./impl/XpathTesterTool').then((m) => ({ default: m.XpathTesterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_YamlPrettifyTool = dynamic(
  () => import('./impl/YamlPrettifyTool').then((m) => ({ default: m.YamlPrettifyTool })),
  { loading: ToolRouteLoading },
)

const Lazy_YamlToJsonConverterTool = dynamic(
  () => import('./impl/YamlToJsonConverterTool').then((m) => ({ default: m.YamlToJsonConverterTool })),
  { loading: ToolRouteLoading },
)

const Lazy_YamlToTomlTool = dynamic(
  () => import('./impl/YamlToTomlTool').then((m) => ({ default: m.YamlToTomlTool })),
  { loading: ToolRouteLoading },
)

export const TOOL_LAZY_MAP: Record<string, ComponentType> = {
  'ascii-text-drawer': Lazy_AsciiTextDrawerTool,
  'base-converter': Lazy_BaseConverterTool,
  'us-address-generator': Lazy_UsAddressGeneratorTool,
  'uk-address-generator': Lazy_UkAddressGeneratorTool,
  'hk-address-generator': Lazy_HkAddressGeneratorTool,
  'sg-address-generator': Lazy_SgAddressGeneratorTool,
  'california-address-generator': Lazy_CaliforniaAddressGeneratorTool,
  'newzealand-address-generator': Lazy_NewZealandAddressGeneratorTool,
  'spain-address-generator': Lazy_SpainAddressGeneratorTool,
  'base64-file-converter': Lazy_Base64FileConverterTool,
  'base64-string-converter': Lazy_Base64StringConverterTool,
  'basic-auth-generator': Lazy_BasicAuthGeneratorTool,
  'bcrypt': Lazy_BcryptTool,
  'benchmark-builder': Lazy_BenchmarkBuilderTool,
  'bitmap-image-suite': Lazy_BitmapImageSuiteTool,
  'bip39-generator': Lazy_Bip39GeneratorTool,
  'camera-recorder': Lazy_CameraRecorderTool,
  'case-converter': Lazy_CaseConverterTool,
  'chart-from-csv': Lazy_ChartFromCsvTool,
  'chmod-calculator': Lazy_ChmodCalculatorTool,
  'chronometer': Lazy_ChronometerTool,
  'cidr-calculator': Lazy_Ipv4SubnetCalculatorTool,
  'code-formatter': Lazy_CodeFormatterTool,
  'color-converter': Lazy_ColorConverterTool,
  'cron-parser': Lazy_CrontabGeneratorTool,
  'crontab-generator': Lazy_CrontabGeneratorTool,
  'csv-toolkit': Lazy_CsvToolkitTool,
  'css-beautify-minify': Lazy_CssBeautifyMinifyTool,
  'curl-to-code': Lazy_CurlToCodeTool,
  'date-converter': Lazy_DateConverterTool,
  'device-information': Lazy_DeviceInformationTool,
  'dns-lookup': Lazy_DnsLookupTool,
  'docker-run-to-docker-compose-converter': Lazy_DockerRunToDockerComposeConverterTool,
  'emoji-picker': Lazy_EmojiPickerTool,
  'excalidraw-whiteboard': Lazy_ExcalidrawWhiteboardTool,
  'favicon-ico-generator': Lazy_FaviconIcoGeneratorTool,
  'encoding-toolkit': Lazy_EncodingToolkitTool,
  'encryption': Lazy_EncryptionTool,
  'escape-native-converter': Lazy_EscapeNativeConverterTool,
  'eta-calculator': Lazy_EtaCalculatorTool,
  'git-memo': Lazy_GitMemoTool,
  'gzip-decompress': Lazy_GzipDecompressTool,
  'hash-text': Lazy_HashTextTool,
  'hmac-generator': Lazy_HmacGeneratorTool,
  'html-entities': Lazy_HtmlEntitiesTool,
  'html-js-literal-converter': Lazy_HtmlJsLiteralTool,
  'html-stripper': Lazy_HtmlStripperTool,
  'html-table-tools': Lazy_HtmlTableToolsTool,
  'html-to-jsx': Lazy_HtmlToJsxTool,
  'html-to-markdown': Lazy_HtmlToMarkdownTool,
  'html-wysiwyg-editor': Lazy_HtmlWysiwygEditorTool,
  'http-status-codes': Lazy_HttpStatusCodesTool,
  'iban-validator-and-parser': Lazy_IbanValidatorAndParserTool,
  'image-data-uri-helper': Lazy_ImageDataUriHelperTool,
  'image-format-converter': Lazy_ImageFormatConverterTool,
  'image-lsb-steganography': Lazy_ImageLsbSteganographyTool,
  'gemini-watermark-remover': Lazy_GeminiWatermarkRemoverTool,
  'ip-representation-converter': Lazy_IpRepresentationConverterTool,
  'ipv4-address-converter': Lazy_Ipv4AddressConverterTool,
  'ipv4-range-expander': Lazy_Ipv4RangeExpanderTool,
  'ipv4-subnet-calculator': Lazy_Ipv4SubnetCalculatorTool,
  'ipv6-ula-generator': Lazy_Ipv6UlaGeneratorTool,
  'json-diff': Lazy_JsonDiffTool,
  'json-jsonl-converter': Lazy_JsonJsonlTool,
  'json-minify': Lazy_JsonMinifyTool,
  'json-prettify': Lazy_JsonPrettifyTool,
  'json-syntax-helper': Lazy_JsonSyntaxHelperTool,
  'json-to-csv': Lazy_JsonToCsvTool,
  'json-to-toml': Lazy_JsonToTomlTool,
  'json-to-yaml-converter': Lazy_JsonToYamlConverterTool,
  'jsonpath-tester': Lazy_JsonpathTesterTool,
  'javascript-compress': Lazy_JavascriptCompressTool,
  'js-html-prettify': Lazy_JsHtmlPrettifyTool,
  'jwt-parser': Lazy_JwtParserTool,
  'keycode-info': Lazy_KeycodeInfoTool,
  'list-converter': Lazy_ListConverterTool,
  'lorem-ipsum-generator': Lazy_LoremIpsumGeneratorTool,
  'mac-address-generator': Lazy_MacAddressGeneratorTool,
  'mac-address-lookup': Lazy_MacAddressLookupTool,
  'markdown-to-html': Lazy_MarkdownToHtmlTool,
  'math-evaluator': Lazy_MathEvaluatorTool,
  'mermaid-preview': Lazy_MermaidPreviewTool,
  'mime-types': Lazy_MimeTypesTool,
  'numeronym-generator': Lazy_NumeronymGeneratorTool,
  'og-meta-generator': Lazy_OgMetaGeneratorTool,
  'pdf-to-image': Lazy_PdfToImageTool,
  'otp-generator': Lazy_OtpGeneratorTool,
  'password-strength-analyser': Lazy_PasswordStrengthAnalyserTool,
  'percentage-calculator': Lazy_PercentageCalculatorTool,
  'phone-parser-and-formatter': Lazy_PhoneParserAndFormatterTool,
  'qrcode-generator': Lazy_QrcodeGeneratorTool,
  'random-port-generator': Lazy_RandomPortGeneratorTool,
  'rem-px-converter': Lazy_RemPxConverterTool,
  'roman-numeral-converter': Lazy_RomanNumeralConverterTool,
  'rsa-key-pair-generator': Lazy_RsaKeyPairGeneratorTool,
  'safelink-decoder': Lazy_SafelinkDecoderTool,
  'server-raster-image-converter': Lazy_ServerRasterImageConverterTool,
  'slugify-string': Lazy_SlugifyStringTool,
  'sql-prettify': Lazy_SqlPrettifyTool,
  'sql-to-data-formats': Lazy_SqlToDataFormatsTool,
  'string-obfuscator': Lazy_StringObfuscatorTool,
  'structured-data-viewer': Lazy_StructuredDataViewerTool,
  'svg-placeholder-generator': Lazy_SvgPlaceholderGeneratorTool,
  'tabular-spreadsheet-converter': Lazy_TabularSpreadsheetConverterTool,
  'temperature-converter': Lazy_TemperatureConverterTool,
  'text-diff': Lazy_TextDiffTool,
  'text-line-processor': Lazy_TextLineProcessorTool,
  'text-statistics': Lazy_TextStatisticsTool,
  'text-to-binary': Lazy_TextToBinaryTool,
  'text-to-nato-alphabet': Lazy_TextToNatoAlphabetTool,
  'text-to-unicode': Lazy_TextToUnicodeTool,
  'token-generator': Lazy_TokenGeneratorTool,
  'utf-8-inspector': Lazy_Utf8InspectorTool,
  'toml-to-json': Lazy_TomlToJsonTool,
  'toml-to-yaml': Lazy_TomlToYamlTool,
  'ulid-generator': Lazy_UlidGeneratorTool,
  'unit-converter': Lazy_UnitConverterTool,
  'ubb-html-converter': Lazy_UbbHtmlConverterTool,
  'url-encoder': Lazy_UrlEncoderTool,
  'url-parser': Lazy_UrlParserTool,
  'user-agent-parser': Lazy_UserAgentParserTool,
  'uuid-generator': Lazy_UuidGeneratorTool,
  'wifi-qrcode-generator': Lazy_WifiQrcodeGeneratorTool,
  'xml-diff': Lazy_XmlDiffTool,
  'xml-formatter': Lazy_XmlFormatterTool,
  'xpath-tester': Lazy_XpathTesterTool,
  'yaml-prettify': Lazy_YamlPrettifyTool,
  'yaml-to-json-converter': Lazy_YamlToJsonConverterTool,
  'yaml-to-toml': Lazy_YamlToTomlTool,
}
